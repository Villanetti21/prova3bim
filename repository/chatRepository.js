import { connection } from "../connection.js";


export async function inserirMensagem(chat) {
  const comando = `
    insert into chat (usuario_id, sala_id, mensagem, criacao)
         values (?, ?, ?, now())
  `;
  const [info] = await connection.query(comando, [
    chat.usuario_id,
    chat.sala_id,
    chat.mensagem
  ]);
  return info;
}


export async function listarMensagensPorSala(salaId) {
  const comando = `
    select chat.id,
           chat.usuario_id,
           usuario.nome,
           chat.mensagem,
           chat.criacao
      from chat
    inner join usuario on chat.usuario_id = usuario.id
    where chat.sala_id = ?
    order by chat.criacao asc
  `;
  const [registros] = await connection.query(comando, [salaId]);
  return registros;
}
