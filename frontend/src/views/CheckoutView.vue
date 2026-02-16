<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-black text-black mb-2">Checkout</h1>
        <p class="text-gray-600">Complete your purchase</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Checkout Form -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Shipping Information -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h2 class="text-xl font-bold text-black mb-4">Shipping Information</h2>
            <form class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">City</label>
                  <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Postal Code</label>
                  <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                </div>
              </div>
            </form>
          </div>

          <!-- Payment Information -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h2 class="text-xl font-bold text-black mb-4">Payment Information</h2>
            <form class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                <input type="text" placeholder="1234 5678 9012 3456" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                  <input type="text" placeholder="MM/YY" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                  <input type="text" placeholder="123" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                </div>
              </div>
            </form>
          </div>

          <!-- Place Order Button -->
          <button class="w-full px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition text-lg">
            Place Order
          </button>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
            <h2 class="text-xl font-bold text-black mb-4">Order Summary</h2>
            
            <!-- Empty State -->
            <div class="py-8 text-center text-gray-600">
              <p class="text-sm">No items in cart</p>
            </div>

            <!-- Items (when present) -->
            <div class="hidden space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div class="flex justify-between text-sm">
                <span>Product Name</span>
                <span>$25.99</span>
              </div>
            </div>

            <div class="space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>$0.00</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
            </div>

            <div class="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>$0.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Checkout View
</script>
