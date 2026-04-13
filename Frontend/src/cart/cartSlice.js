import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: [],
};

const cartSlice = createSlice({
    name: 'cart',//this is the name of the slice, it will be used to identify the slice in the store
    initialState,
    reducers:{ // in the reducesr we write the functions that will be used to update the state, these functions will be called from the component(frontend) when we want to update the state
        addToCart: (state, action) =>{
            const item = action.payload; // action.payload will contain the data we sent from the componenet(frontend)
            const existing = state.cartItems.find(i=> i.productId == item.productId);
            if(existing){
                existing.quantity += item.quantity;
            }
            else{
                state.cartItems.push({productId:item.productId, quantity: item.quantity});
            }

        },
        removeFromCart: (state, action) =>{
            const item = action.payload; // action.payload will contain the data we sent from the componenet(frontend)
            state.cartItems = state.cartItems.filter( i => i.productId !== item.productId);
         },

         increaseQuantity: (state, action)=>{
            const item = action.payload;
            const existing = state.cartItems.find(i=> i.productId === item.productId);
            if(existing) existing.quantity += 1;
         },

         decreaseQuantity: (state, action)=>{
            const item = action.payload;
            const exists = state.cartItems.find(i => i.productId === item.productId);
            if(exists){
                if(exists.quantity > 1){
                    exists.quantity -= 1;
                }
                else{
                    state.cartItems = state.cartItems.filter(i => i.productId !== item.productId);
                }
            }
         }

    }
});

export const {addToCart, removeFromCart, increaseQuantity, decreaseQuantity} = cartSlice.actions; // this will export the functions we created in the reducers, so we can use them in the component(frontend)

export default cartSlice.reducer; // this will export the reducer function, so we can use it in the store to update the state