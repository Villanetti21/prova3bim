import { connection } from "../connection.js";


export async function inserirSala(novaSala) {
  const comando = `
    insert into sala (nome, criador_id)
         values (?, ?)
  `;
  const [info] = await connection.query(comando, [
    novaSala.nome,
    novaSala.criador_id
  ]);
  return info;
}


export async function buscarPorId(salaId) {
  const comando = `
    select id, nome, criador_id
    from sala
    where id = ?
  `;
  const [registros] = await connection.query(comando, [salaId]);
  return registros[0];
}
