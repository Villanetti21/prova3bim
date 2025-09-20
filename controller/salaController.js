import { Router } from 'express';
import { getAuthentication } from '../utils/jwt.js';

import * as salaRepo from '../repository/salaRepository.js';
import * as salaPermissaoRepo from '../repository/salaPermissaoRepository.js';

const endpoints = Router();
const autenticador = getAuthentication();


endpoints.post('/sala', autenticador, async (req, resp) => {
  try {
    const usuarioLogadoId = req.user.id;
    const { nome } = req.body;

  
    if (!nome || nome.trim() === '') {
      return resp.status(400).json({ erro: 'Nome da sala é obrigatório.' });
    }

    
    const resultado = await salaRepo.inserirSala({
      nome,
      criador_id: usuarioLogadoId
    });

    
    await salaPermissaoRepo.inserirPermissao({
      sala_id: resultado.insertId,
      usuario_id: usuarioLogadoId,
      aprovado: true
    });


    return resp.status(201).json({
      mensagem: 'Sala criada com sucesso.',
      salaId: resultado.insertId
    });
  } 
  
  catch (err) {
    console.error(err);
    return resp.status(500).json({ erro: 'Erro ao criar sala.' });
  }
  
});

export default endpoints;