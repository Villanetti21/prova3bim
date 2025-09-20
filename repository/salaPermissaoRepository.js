import { connection } from "../connection.js";


export async function inserirPermissao(permissao) {
  const comando = `
    insert into salaPermissao (sala_id, usuario_id, aprovado)
         values (?, ?, ?)
  `;
  const [info] = await connection.query(comando, [
    permissao.sala_id,
    permissao.usuario_id,
    permissao.aprovado
  ]);
  return info;
}


export async function aprovarUsuarioNaSala(salaId, usuarioId) {
  const comando = `
    update salaPermissao
       set aprovado = true
     where sala_id = ? 
     and usuario_id = ?
  `;
  const [info] = await connection.query(comando, [salaId, usuarioId]);
  return info;
}


export async function buscarPermissaoPorSalaUsuario(salaId, usuarioId) {
  const comando = `
    select id, aprovado
      from salaPermissao
     where sala_id = ? 
     and usuario_id = ? 
     and aprovado = true
  `;
  const [registros] = await connection.query(comando, [salaId, usuarioId]);
  return registros[0];
}
