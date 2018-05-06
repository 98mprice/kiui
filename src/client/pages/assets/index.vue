<template>
  <!--<v-container>-->
    <v-layout column style="padding: 10px">
      <v-layout row wrap id="top_buttons">
        <v-flex xs5>
          <v-select label="Sort By" :items="sort_by_items" v-model="sort_by"></v-select>
        </v-flex>
        <v-flex xs7>
          <v-text-field
              prepend-icon="search"
              append-icon="mic"
              label="Search"
              solo-inverted
              flat
            ></v-text-field>
        </v-flex>
      </v-layout>
      <v-card
        v-for="card in cards"
        class="mb-2"
        light
        style="border-radius: 20px; background-color: rgba(255, 255, 255, 0.0); position:relative"
        >
          <img
            style="position:absolute; bottom:0; height: 230px; z-index: 2; right: 0px; left: 0px; margin: 0 auto;"
            :src="card.character"
            />
            <div style="position:absolute; bottom:0; height: 50px; width: 100%; z-index: 1; background-color: #ffffff; border-bottom-right-radius: 20px; border-bottom-left-radius: 20px;">
            </div>
        <v-card-media
          height="180px"
        >
        <div v-ripple @click="$router.push('/info/' + card.id)" class="novel-text main-gradient" style="opacity: 0.5; height: 100%; padding-top: 60px; width: 100%; position: absolute; z-index: 2; text-align: center; color: #ffffff; border-top-left-radius: 20px; border-top-right-radius: 20px;">
          <div style="font-size: 24px;">{{card.title}}</div>
          <div style="font-size: 21px;">by <i>{{card.author}}</i></div>
        </div>
        <img
          style="z-index: 1; border-top-left-radius: 20px; border-top-right-radius: 20px;"
          v-blur="blurConfig"
          :src="card.background"
          />
        </v-card-media>
        <v-card-actions style="background-color: rgba(255, 255, 255, 0.8); z-index: 3; position: relative;">
          <v-btn icon light @click='toggleLove(card)'>
            <v-icon v-if="love_list.indexOf(card.id) > -1" color="red">favorite</v-icon>
            <v-icon v-else color="grey">favorite</v-icon>
          </v-btn>
          <span  style="color: #9E9E9E">{{card.love_count}}</span>
          <v-spacer></v-spacer>
          <v-btn icon light @click='toggleFavourite(card)'>
            <v-icon v-if="favourite_list.indexOf(card.id) > -1" color="yellow">bookmark</v-icon>
            <v-icon v-else color="grey">bookmark</v-icon>
          </v-btn>
          <v-btn icon light>
            <v-icon color="grey">share</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-layout>
  <!--</v-container>-->
</template>

<script>
export default {
  fetch ({ store }) {
      return store.dispatch('fetchAllAssets')
  }
}
</script>
