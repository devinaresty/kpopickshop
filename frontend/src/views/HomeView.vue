<template>
  <div class="bg-gray-100 min-h-screen">
    <HeroSection />

    <PopularAlbumArtistSection />

    <RecommendationSection />

    <Footer />

    <BackToTopButton />
  </div>
</template>

<script setup lang="ts">
import HeroSection from '@/modules/landing/components/sections/HeroSection.vue'
import PopularAlbumArtistSection from '@/modules/landing/components/sections/PopularAlbumArtistSection.vue'
import RecommendationSection from '@/modules/landing/components/sections/RecommendationSection.vue'
import Footer from '@/modules/landing/components/shared/Footer.vue'
import BackToTopButton from '@/modules/landing/components/shared/BackToTopButton.vue'
</script>
