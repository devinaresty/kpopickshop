import { defineStore } from "pinia";
import { apiClient } from "@/core/api/api";

export const useCartStore = defineStore("cart", {
    state: () => ({
        items: [] as any[],
        isLoading: false,
        error: null as string | null,
    }),

    getters: { 

        totalItems: (state) => {
            return state.items.reduce((total, item) => total + item.quantity, 0);
        },

        totalPrice: (state) => {
            return state.items.reduce((total, item) => total + (item.product.quantity * item.price), 0);
        }
    },

    actions: {
        async fetchCart() {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await apiClient.getCart();
                this.items = response?.items || [];
            } catch (error: any) {
                this.error = error.message || "Failed to fetch cart";
                console.error("Error fetching cart:", error);
            } finally {
                this.isLoading = false;
            }
        },

        async addToCart(productId: number, quantity: number = 1) {
            this.isLoading = true;
            this.error = null;
            try {
                await apiClient.addToCart( productId, quantity);
                await this.fetchCart(); 
            } catch (error: any) {
                this.error = error.message || "Failed to add item to cart";
                console.error("Error adding item to cart:", error);
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async updateItemQuantity(cartItemId: number, quantity: number) {
            this.isLoading = true;
            this.error = null;
            try {
                await apiClient.updateCartItemQuantity(cartItemId, quantity);
                await this.fetchCart();
            } catch (error: any) {
                this.error = error.message || "Failed to update item quantity";
                console.error("Error updating item quantity:", error);
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async removeItem(cartItemId: number) {
            this.isLoading = true;
            this.error = null;
            try {
                await apiClient.removeCartItem(cartItemId);
                await this.fetchCart();
            } catch (error: any) {
                this.error = error.message || "Failed to remove item from cart";
                console.error("Error removing item from cart:", error);
                throw error;
            } finally {
                this.isLoading = false;
            }
        }
    },
});