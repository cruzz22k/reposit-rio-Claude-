// cast.js — uma roupa por personagem. A cor-assinatura é a identidade; igual em todas as cenas.
export const VOCE = { top: 'tshirt', color: '#3a6ea5', head: 'none' };                                  // "você" (azul)
export const VOCE_KID = { ...VOCE, kid: true };                                                          // "você" criança
export const VOCE_SOLDADO = { top: 'suit', color: '#4f5a36', head: 'cap', headColor: '#4f5a36' };        // "você" no exército
export const MAE = { top: 'dress', color: '#8a5ad6', head: 'bun' };                                      // mãe (roxo)
export const PAI = { top: 'tracksuit', color: '#2f8f6f', head: 'none' };                                 // pai (verde)
export const OFICIAL = { top: 'trench', color: '#1a1622', head: 'fedora', headColor: '#1a1622' };        // o Estado
export const VIZINHA = { top: 'dress', color: '#f2c21a', head: 'bun' };                                  // chefe do bairro (amarelo)
export const PROF = { top: 'suit', color: '#3a3a48', head: 'none', face: 'glasses' };                    // professora
export const SOLDADO = { top: 'suit', color: '#4f5a36', head: 'cap', headColor: '#4f5a36' };             // guarda / soldado
export const POLICIA = { top: 'suit', color: '#25304a', head: 'cap', headColor: '#25304a' };             // polícia chinesa
export const KID = { top: 'none', kid: true };                                                           // colegas (silhueta)
export const LENCO = '#d8362b';                                                                          // lenço vermelho / partido
export const CAST = [VOCE, MAE, PAI, VIZINHA, OFICIAL];
