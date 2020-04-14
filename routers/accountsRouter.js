// dependencies
const express = require('express');

const db = require('../data/dbConfig');

// router setup
const router = express.Router();

router.get('/', (req, res) => {
    const { limit, sortby, sortdir } = req.query;
    db('accounts')
        .modify((queryBuilder) => {
            if (limit) {
                queryBuilder.limit(limit)
            }
            if (sortdir) {
                if (sortby) {
                    queryBuilder.orderBy(sortby, sortdir)
                } else {
                    queryBuilder.orderBy('id', sortdir)
                }
            }
            if (sortby) {
                queryBuilder.orderBy(sortby)
            }
        })
        .then((accounts) => {
            res.status(200).json({ data: accounts })
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: error.message })
        })
})

router.get('/:id', (req, res) => {
    const { id } = req.params
    db('accounts')
        .where({ id })
        .first()
        .then(account => {
            if (account) {
                res.status(200).json({ data: account })
            } else {
                res.status(404).json({ message: `No account found with id ${id}` })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: error.message })
        })
})

router.post('/', (req, res) => {
    const accountData = req.body;
    db('accounts')
        .insert(accountData)
        .then((ids) => {
            db('accounts')
                .where({ id: ids[0] })
                .first()
                .then((account) => {
                    res.status(201).json({ data: account })
                })
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: error.message })
        })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params
    db('accounts')
        .where({ id })
        .del()
        .then((count) => {
            if (count) {
                res.status(200).json({ message: `${count} account${count !== 1 ? 's' : ''} successfully deleted`})
            } else {
                res.status(404).json({ message: `No account found with id ${id}` })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: error.message })
        })
})

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const accountData = req.body;
    db('accounts')
        .where({ id })
        .update(accountData)
        .then((count) => {
            if (count) {
                res.status(200).json({ message: `${count} account${count !== 1 ? 's' : ''} successfully updated` })
            } else {
                res.status(404).json({ message: `No account found with id ${id}` })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: error.message })
        })
})

module.exports = router;
