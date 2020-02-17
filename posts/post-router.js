const express = require('express');

// database access using knex
const db = require('../data/db-config.js');

const router = express.Router();

router.get('/', (req, res) => {
    // SELECT FROM POSTS
    // ALL DATABASE OPS RETURN A PROMIS SO NEED .THEN() AND .CATCH()
    db.select('*')
        .from('posts')
        .then(posts => {
        res.status(200).json(posts)
    }).catch(err => {
        console.log(err)
        res.status(500).json({ error: 'Failed to get list of posts'})
    })
});

router.get('/:id', (req, res) => {
    // select * from posts where id = :id
    db('posts').where({ id: req.params.id })
    // FIRST eliminates having to do .json(post[0])
    .first() // Grabs first item on returned array
    .then(post => {
        res.status(200).json(post)
    }).catch(err => {
        console.log(err)
        res.status(500).json({ error: 'Failed to get list of posts'})
    })
});

router.post('/', (req, res) => {
    // insert into posts () values ()
    db('posts')
        .insert(req.body, 'id') // will generate a warning on console when using sqlite, ignore it
        .then(ids => {
            db('posts')
            .where('id', ids[0])
            .then(post =>{
                res.status(201).json(post)
            })
            
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: 'Failed to get list of posts'})
        })

});

router.put('/:id', (req, res) => {
    db('posts')
    .where({ id: req.params.id }) // DONT FORGET OR ALL RECORDS WILL BE UPDATED
    .update(req.body) // CAN BE PARTIAL CHANGES
    .then(count => {
        res.status(200).json(count)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: 'Failed to get list of posts'})
    })
});

router.delete('/:id', (req, res) => {
    db('posts')
    .where({ id: req.params.id }) 
    .delete() 
    .then(count => {
        res.status(200).json(count)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: 'Failed to get list of posts'})
    })
});

module.exports = router;

///////// BONUS FOR POST TO RETURN NEW POST //////////
router.post("/", (req, res) => {
    // add a post
    // insert into posts () values ()
    db("posts")
      .insert(req.body, "id") // will generate a warning on console when using sqlite, ignore that
        .then(ids => {
        // adding that return sends any errors up the chain to be
        // handled by the catch in line 50. Reading up on Promises will make it clearer.
        return getById(ids[0]).then(inserted => {
            res.status(201).json(inserted);
        });
        })
        .catch(error => {
        console.log(error);

        res.status(500).json({ error: "failed to add the post" });
        });
});

function getById(id) {
    return db("posts")
        .where({ id })
        .first();
}