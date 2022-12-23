const { Pizza } = require('../models'); 

const pizzaController = {
    //function go here as methods
    //get all pizzas
    getAllPizza(req, res){
        Pizza.find({})
        .populate({
            path: 'comments',
            // remove __v field rom MongoDB response (-) sign means remove 
            select: '-__v'
        })
        .select('-__v')
        //sort by descending order by ID value, obtain newest pizza
        .sort({ _id: -1 })
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    }, 

    //get one pizza by ID
    getPizzaByID({ params }, res){
        Pizza.findOne({ _id: params.id})
        .populate({
            path: 'comments',
            select: '-__v'
          })
        .select('-__v')
        .then(dbPizzaData => {
            //if not pizza is found
            if (!dbPizzaData){
                res.status(404).json({ message: 'No pizza was found with this ID'}); 
                return; 
            }
            res.json(dbPizzaData)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
         })
    },

    //create a pizza
    createPizza({ body }, res) {
        Pizza.create(body)
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        });
    },

    //update Pizza by ID
    updatePizza({ params, body }, res){
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbPizzaData => {
            if(!dbPizzaData){
                res.status(404).json({ message: 'No Pizza found with this ID'}); 
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    }, 

    //delete Pizza
    deletePizza({ params }, res){
        Pizza.findOneAndDelete({ _id: params.id })
        .then(dbPizzaData => {
            if(!dbPizzaData){
                res.status(404).json({message: 'No pizza found with this ID'})
                return;
            }
        res.json(dbPizzaData);    
        })
        .catch(err => res.status(400).json(err));
    }
}

module.exports = pizzaController; 