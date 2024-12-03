const express = require('express');
const axios = require('axios');
const router = express.Router();

// Rota para buscar informações de um CEP
router.get('/:cep', async (req, res) => {
    console.log(`CEP recebido: ${req.params.cep}`); // Debug
    const { cep } = req.params;

    try {
        // Fazendo a requisição à API ViaCEP
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

        if (response.data.erro) {
            return res.status(404).json({ message: 'CEP não encontrado.' });
        }

        // Retorna os dados do endereço
        return res.json(response.data);
    } catch (error) {
        console.error('Erro ao consultar ViaCEP:', error.message);
        return res.status(500).json({ message: 'Erro ao consultar o CEP.' });
    }
});

module.exports = router;
