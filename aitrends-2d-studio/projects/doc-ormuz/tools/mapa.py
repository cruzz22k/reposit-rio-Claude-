# Prepara o mapa real (Natural Earth, domínio público) para o 3D: recorta, simplifica, projeta em km e triangula.
# Saída: web/data/mapa.bin + web/data/mapa.json (camadas: malhas de terra e linhas de costa/fronteira).
import json, os, math, numpy as np, mapbox_earcut as earcut
from shapely.geometry import shape, box, LineString, MultiLineString, Point
from shapely.ops import unary_union
LAT0, LON0 = 26.5, 56.4
KX, KZ = 111.32 * math.cos(math.radians(LAT0)), 110.57
P = lambda lon, lat: ((lon - LON0) * KX, -(lat - LAT0) * KZ)
R = box(44, 18, 66, 34)
load = lambda f: [shape(ft['geometry']) for ft in json.load(open(f'data/{f}.geojson'))['features'] if ft['geometry']]
def polys(g):
    if g.is_empty: return []
    if g.geom_type == 'Polygon': return [g]
    if hasattr(g, 'geoms'): return [p for x in g.geoms for p in polys(x)]
    return []
def lines(g):
    if g.is_empty: return []
    if g.geom_type == 'LineString': return [g]
    if g.geom_type == 'LinearRing': return [LineString(g.coords)]
    if hasattr(g, 'geoms'): return [l for x in g.geoms for l in lines(x)]
    return []
def mesh(pl):
    V, I, off = [], [], 0
    for p in pl:
        rings = [np.array(p.exterior.coords)[:-1]] + [np.array(r.coords)[:-1] for r in p.interiors]
        rings = [r for r in rings if len(r) >= 3]
        if not rings: continue
        v = np.concatenate(rings); ends = np.cumsum([len(r) for r in rings]).astype(np.uint32)
        idx = earcut.triangulate_float64(v.astype(np.float64), ends)
        V.append(np.array([P(x, y) for x, y in v], dtype=np.float32)); I.append(idx.astype(np.uint32) + off); off += len(v)
    return np.concatenate(V), np.concatenate(I)
def segs(ls):
    S = []
    for l in ls:
        c = [P(x, y) for x, y in l.coords]
        for a, b in zip(c[:-1], c[1:]): S += [a, b]
    return np.array(S, dtype=np.float32)
land10 = unary_union([g.intersection(R) for g in load('ne_10m_land') + load('ne_10m_minor_islands') if g.intersects(R)]).simplify(0.004)
land50 = unary_union([g.difference(R) for g in load('ne_50m_land')]).simplify(0.04)
coast10 = unary_union([g.intersection(R) for g in load('ne_10m_coastline') if g.intersects(R)]).simplify(0.004)
coast50 = unary_union([p.exterior for p in polys(unary_union(load('ne_50m_land')))]).difference(R).simplify(0.04)
bord10 = unary_union([g.intersection(R) for g in load('ne_10m_admin_0_boundary_lines_land') if g.intersects(R)]).simplify(0.004)
bord50 = unary_union(load('ne_50m_admin_0_boundary_lines_land')).difference(R).simplify(0.04)
bathy = []
for lv in ['K_200', 'J_1000', 'I_2000', 'H_3000']:
    G = load(f'ne_10m_bathymetry_{lv}')
    reg = unary_union([g.intersection(R) for g in G if g.intersects(R)]).simplify(0.004)
    wld = unary_union([g.difference(R) for g in G]).simplify(0.05)
    bathy += [(f'bat{lv}', 'mesh', polys(reg) + polys(wld)), (f'batl{lv}', 'lines', [l for p in polys(reg) + polys(wld) for l in [LineString(p.exterior.coords)]])]
layers, blob, meta = bathy + [('land10', 'mesh', polys(land10)), ('land50', 'mesh', polys(land50)), ('coast10', 'lines', lines(coast10)), ('coast50', 'lines', lines(coast50)), ('bord10', 'lines', lines(bord10)), ('bord50', 'lines', lines(bord50))], bytearray(), {}
for name, kind, geo in layers:
    if kind == 'mesh':
        v, i = mesh(geo); meta[name] = {'kind': 'mesh', 'v': [len(blob), len(v)]}; blob += v.tobytes(); meta[name]['i'] = [len(blob), len(i)]; blob += i.tobytes()
    else:
        s = segs(geo); meta[name] = {'kind': 'lines', 'v': [len(blob), len(s)]}; blob += s.tobytes()
    print(name, {k: v for k, v in meta[name].items() if k != 'kind'})
meta['proj'] = {'LAT0': LAT0, 'LON0': LON0, 'KX': KX, 'KZ': KZ}
# faixas de navegação (esquema de separação de tráfego, aproximado): linha central e as duas faixas de ~3,2 km
lane = [(55.80, 26.36), (56.10, 26.52), (56.35, 26.60), (56.55, 26.56), (56.72, 26.40), (56.86, 26.14), (56.98, 25.86)]
L = LineString(lane); bad = [Point(p) for p in L.interpolate(np.linspace(0, 1, 200), normalized=True)]
landhit = [round(p.x, 3) for p in bad if land10.buffer(0.03).contains(p)]
print('pontos da faixa sobre terra (com 3 km de folga):', landhit[:10])
meta['lane'] = [P(x, y) for x, y in lane]
places = {'IRA': (56.0, 28.4), 'OMA': (56.25, 25.65), 'ESTREITO': (56.45, 26.56), 'GOLFO': (51.5, 27.0), 'BANDAR_ABBAS': (56.27, 27.18), 'MINAS': (56.62, 26.30)}
meta['places'] = {k: P(*v) for k, v in places.items()}
os.makedirs('web/data', exist_ok=True); open('web/data/mapa.bin', 'wb').write(bytes(blob)); json.dump(meta, open('web/data/mapa.json', 'w'))
print('bytes', len(blob))
