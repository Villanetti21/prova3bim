import { Router } from 'express';
import { getAuthentication } from '../utils/jwt.js';

import * as salaPermissaoRepo from '../repository/salaPermissaoRepository.js';
import * as chatRepo from '../repository/chatRepository.js';

const endpoints = Router();
const autenticador = getAuthentication();


endpoints.post('/chat/:sala', autenticador, async (req, resp) => {
    try {
        const salaId = Number(req.params.sala);
        const usuarioLogadoId = req.user.id;
        const { mensagem } = req.body;

        if (!mensagem || mensagem.trim() === '') {
            return resp.status(400).json({ erro: 'Mensagem não pode ser vazia.' });
        }

        const permissao = await salaPermissaoRepo.buscarPermissaoPorSalaUsuario(salaId, usuarioLogadoId);

        if (!permissao || !permissao.aprovado) {
            return resp.status(403).json({ erro: 'Usuário não tem permissão para enviar mensagens nesta sala.' });
        }

    
        await chatRepo.inserirMensagem({
            usuario_id: usuarioLogadoId,
            sala_id: salaId,
            mensagem
        });

        resp.status(201).json({ mensagem: 'Mensagem enviada com sucesso.' });
    } 
    
    catch (err) {
        console.error(err);
        resp.status(500).json({ erro: 'Erro ao enviar mensagem.' });
    }
});

endpoints.get('/chat/:sala', autenticador, async (req, resp) => {
    try {
        const salaId = Number(req.params.sala);
        const usuarioLogadoId = req.user.id;

      
        const permissao = await salaPermissaoRepo.buscarPermissaoPorSalaUsuario(salaId, usuarioLogadoId);

        if (!permissao || !permissao.aprovado) {
            return resp.status(403).json({ erro: 'Usuário não tem permissão para visualizar mensagens desta sala.' });
        }

        const mensagens = await chatRepo.listarMensagensPorSala(salaId);

        resp.json(mensagens);
    } 
    
    catch (err) {
        console.error(err);
        resp.status(500).json({ erro: 'Erro ao buscar mensagens.' });
    }
});


export default endpoints;

