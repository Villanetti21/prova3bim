import { Router } from 'express';
import { getAuthentication } from '../utils/jwt.js';

import * as salaPermissaoRepo from '../repository/salaPermissaoRepository.js';
import * as salaRepo from '../repository/salaRepository.js';

const endpoints = Router();
const autenticador = getAuthentication();


endpoints.post('/sala/:sala/entrar', autenticador, async (req, resp) => {
  try {
    const salaId = Number(req.params.sala);
    const usuarioLogadoId = req.user.id;

    
    if (!salaId || salaId <= 0) {
      return resp.status(400).json({ erro: 'ID da sala inválido.' });
    }

    await salaPermissaoRepo.inserirPermissao({
      sala_id: salaId,
      usuario_id: usuarioLogadoId,
      aprovado: false
    });

    return resp.status(201).json({
      mensagem: 'Solicitação enviada, aguardando aprovação.'
    });
  } 
  
  catch (err) {
    console.error(err);
    return resp.status(500).json({
      erro: 'Erro ao solicitar entrada na sala.'
    });
  }
});



endpoints.post('/sala/:sala/aprovar/:usuario', autenticador, async (req, resp) => {
  try {
    const salaId = Number(req.params.sala);
    const usuarioParaAprovarId = Number(req.params.usuario);
    const usuarioLogadoId = req.user.id;


    if (!salaId || salaId <= 0) {
      return resp.status(400).json({ erro: 'ID da sala inválido.' });
    }
    if (!usuarioParaAprovarId || usuarioParaAprovarId <= 0) {
      return resp.status(400).json({ erro: 'ID do usuário inválido.' });
    }

  
    const sala = await salaRepo.buscarPorId(salaId);
    if (!sala) {
      return resp.status(404).json({ erro: 'Sala não encontrada.' });
    }

    if (sala.criador_id !== usuarioLogadoId) {
      return resp.status(403).json({
        erro: 'Somente o criador da sala pode aprovar usuários.'
      });
    }

   
    await salaPermissaoRepo.aprovarUsuarioNaSala(salaId, usuarioParaAprovarId);

    return resp.json({
      mensagem: 'Usuário aprovado com sucesso.'
    });
  } catch (err) {
    console.error(err);
    return resp.status(500).json({
      erro: 'Erro ao aprovar usuário.'
    });
  }
});




export default endpoints;