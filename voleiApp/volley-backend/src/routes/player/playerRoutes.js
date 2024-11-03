const express = require('express');
const router = express.Router();
const db = require('../../db'); // Importa a conexão com o banco de dados

// Rota para verificar disponibilidade de quadras
router.get('/quadras/disponiveis', async (req, res) => {
    try {
        // Consulta as empresas com quadras disponíveis
        const empresas = await db.query(`
            SELECT c.id_empresa, c.nome AS empresa_nome, ct.id_quadra, ct.nome AS quadra_nome, ct.tipo_quadra
            FROM companies c
            JOIN courts ct ON c.id_empresa = ct.id_empresa
            WHERE ct.id_quadra NOT IN (
                SELECT id_quadra
                FROM court_reservations
                WHERE data_reserva = CURRENT_DATE
                  AND status_reserva = 'confirmada'
            )
            ORDER BY c.nome, ct.nome;
        `);
        res.status(200).json(empresas.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar quadras disponíveis", error });
    }
});

module.exports = router;