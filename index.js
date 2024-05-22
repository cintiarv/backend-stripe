const express = require('express')
const app = express()
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const cors = require('cors')

app.use(express.json())
app.use(cors({origin:"http://localhost:3000/"}))


//route
app.post("/checkout", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: req.body.items.map(item => {
                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.name
                        },
                        unit_amount: (item.price) * 100
                    },
                    quantity: item.quantity
                }
            }),
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel"
        })
        res.json({ url: session.url })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})



app.listen(8000,
    console.log('listen on port 8000 :>> ')
)