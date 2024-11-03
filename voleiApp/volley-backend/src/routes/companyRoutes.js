const express = require('express');
const router = express.Router();
const pool = require('../db'); // Certifique-se de que o pool está apontando para a configuração correta do banco de dados

// Rota para listar empresas com quadras disponíveis
router.get('/disponiveis', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT DISTINCT c.id_empresa AS id_empresa, c.nome AS empresa_nome
            FROM companies AS c
            JOIN courts AS ct ON ct.company_id = c.id_empresa
            WHERE ct.status = 'disponivel'
        `);
        
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar empresas com quadras disponíveis:', error);
        res.status(500).json({ message: 'Erro ao buscar empresas' });
    }
});

// Rota para listar quadras disponíveis de uma empresa específica
router.get('/:empresaId/quadras/disponiveis', async (req, res) => {
    const { empresaId } = req.params;
    try {
        const result = await pool.query(`
            SELECT ct.id_quadra AS id_quadra, ct.nome AS quadra_nome, ct.tipo_quadra
            FROM courts AS ct
            WHERE ct.company_id = $1 AND ct.status = 'disponivel'
        `, [empresaId]);
        
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar quadras disponíveis para a empresa:', error);
        res.status(500).json({ message: 'Erro ao buscar quadras' });
    }
});

module.exports = router;
