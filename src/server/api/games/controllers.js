import Game from './models/game_models'
import Chapter from './models/chapter_models'
import Review from './models/review_models'
import Comment from './models/comment_models'
import User from '../users/models'
import Base_Asset from '../assets/models/base_models'
import { ServerError } from 'express-server-error'

export const game_index = {
  /**
   *  Finds all games or specific game by id and returns array
   */
  async get (req, res) {
    console.log("getting game" + req.params.game_id)
    try {
      if (req.params.game_id) {
        let game = await Game.findById(req.params.game_id)
        if (!game) throw new ServerError('No game with that id exists at this moment.', { status: 404 })
        var character_url = ""
        if (game.character) {
          let character = await Base_Asset.findById(game.character)
          if (character) {
            character_url = character.url
          }
        }
        var background_url = ""
        if (game.background) {
          let background = await Base_Asset.findById(game.background)
          if (background) {
            background_url = background.url
          }
        }
        res.json({
          username: fetchedGame.username,
          title: fetchedGame.title,
          love_count: fetchedGame.love_count,
          character: character_url,
          background: background_url/*,*/
          //message: `Authentication by ${req.params.fetchedGame.username} required to view more...`
        })
      } else {
        console.log("getting all games")
        let games = await Game.find({})
        if (!games) throw new ServerError('No games exist at this moment.', { status: 404 })
        res.json(await games_format_index(games))
      }
    } catch (error) {
      res.handleServerError(error)
    }
  },
  /**
   *  Adds a new game based on input or edits existing game
   */
  async post (req, res) {
    try {
      if (req.params.game_id) {
        let game = await Game.findById(req.params.game_id)
        if (!game) throw new ServerError('No game with that id exists at this moment.', { status: 404 })
        let { title, character, background } = req.body
        if (title) {
          game.title = title
        }
        if (character) {
          game.character = character
        }
        if (background) {
          game.background = background
        }
        let saved_game = await game.save()
        res.json({ message: `${saved_game.title} saved` })
      } else {
        let { title, username, character, background } = req.body
        var love_count = 0;
        console.log(title + ", " + username)
        let newGame = new Game({ title, username, love_count, character, background })
        let savedGame = await newGame.save()
        res.json({ message: `${savedGame.title} saved` })
      }
    } catch (error) {
      res.handleServerError(error)
    }
  }
}

async function games_format_index(games) {
  var updated_games = [];
  for (var i = 0; i < games.length; i++) {
    var game = games[i]
    var character_url = ""
    if (game.character) {
      let character = await Base_Asset.findById(game.character)
      console.log("found" + character + "for" + game.character)
      if (character) {
        character_url = character.url
      }
    }
    var background_url = ""
    if (game.background) {
      let background = await Base_Asset.findById(game.background)
      if (background) {
        background_url = background.url
      }
    }
    updated_games.push({
      tags: game.tags,
      id: game._id,
      username: game.username,
      title: game.title,
      love_count: game.love_count,
      character: character_url,
      background: background_url
    })
  }
  console.log(JSON.stringify(updated_games))
  return updated_games
}

export const game_love_index = {
  /**
   *  Adds or subtracts from current love for game
   */
  async post (req, res) {
    console.log("OK ADDING LOVE TO USER BOI " + req.params.game_id)
    try {
      let game = await Game.findById(req.params.game_id)
      if (!game) throw new ServerError(`No game with id ${req.params.game_id} exists.`, { status: 404 })
      let users = await User.find({ username: req.params.username })
      if (!users) throw new ServerError(`No user with username ${req.params.username} exists.`, { status: 404 })
      var user = users[0]
      console.log("ok adding to list" + JSON.stringify(user.love_list))
      console.log(user.love_list.indexOf(req.params.game_id))
      if (user.love_list.indexOf(req.params.game_id) > -1) {
        console.log("it already exists here")
        //it exists
        var index = user.love_list.indexOf(req.params.game_id);
        if (index !== -1) {
          user.love_list.splice(index, 1);
          game.love_count = game.love_count - 1;
        }
      } else {
        console.log("ok it doesn't exist adding it")
        user.love_list.push(req.params.game_id)
        game.love_count = game.love_count + 1
      }
      console.log("ok adding to list ok" + JSON.stringify(user.love_list))
      let saved_user = await user.save()
      let saved_game = await game.save()
      res.json({
        message: `${saved_game.title} saved for ${saved_user.username}`
      })
    } catch (error) {
      res.handleServerError(error)
    }
  }
}

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

export const game_search_index = {
  /**
   *  Finds all games or specific game by id and returns array
   */
  async get (req, res) {
    try {
      console.log("searching for" + req.params.search_term)
      const regex = new RegExp(escapeRegex(req.params.search_term), 'gi');
      let games = await Game.find({
          /*title: regex,*/
          $or: [
                { title: regex },
                { tags: regex }
            ]
          })
      //if (!game) throw new ServerError('No game with that id exists at this moment.', { status: 404 })
      //Games.find({ "title": regex }, function(err, foundjobs) {
      //     if(err) {
      //         console.log(err);
      //     } else {
      //        res.render("jobs/index", { jobs: foundjobs });
      //     }
      //});
      console.log("returning " + JSON.stringify(games))
      res.json(await games_format_index(games))
    } catch (error) {
      res.handleServerError(error)
    }
  }
}

export const game_bookmark_index = {
  /**
   *  Adds or subtracts from current bookmark for game
   */
  async post (req, res) {
    try {
      let game = await Game.findById(req.params.game_id)
      if (!game) throw new ServerError(`No game with id ${req.params.game_id} exists.`, { status: 404 })
      let user = await User.find({ username: req.params.username })
      if (!user) throw new ServerError(`No user with username ${req.params.username} exists.`, { status: 404 })
      if (user.bookmark_list.indexOf(req.params.game_id) > -1) {
        //it exists
        var index = user.bookmark_list.indexOf(req.params.game_id);
        if (index !== -1) {
          user.bookmark_list.splice(index, 1);
        }
      } else {
        user.bookmark_list.push(req.params.game_id)
      }
      let saved_user = await user.save()
      let saved_game = await game.save()
      res.json({
        message: `${saved_game.title} saved for ${saved_user.username}`
      })
    } catch (error) {
      res.handleServerError(error)
    }
  }
}

export const review_index = {
  /**
   *  Finds all reviews for specified game by index and returns array
   */
  async get (req, res) {
    try {
      let reviews = Reviews.find({ game: req.params.game_id })
      if (!reviews) throw new ServerError('No reviews for the game with that id exist at this moment.', { status: 404 })
      res.json(reviews)
    } catch (error) {
      res.handleServerError(error)
    }
  },
  /**
   *  Adds a new review for a game
   */
  async post (req, res) {
    try {
      let { title, username, score, message } = req.body
      var love_count = 0;
      var game_id = req.params.game_id
      let newReview = new Review({ title, username, love_count, score, message, game_id })
      let savedReview = await newReview.save()
      res.json({ message: `${savedReview.title} Saved` })
    } catch (error) {
      res.handleServerError(error)
    }
  }
}

export const review_love_index = {
  /**
   *  Adds or subtracts from current love for review
   */
  async post (req, res) {
    try {
      let review = await Review.findById(req.params.review_id)
      if (!review) throw new ServerError(`No review with id ${req.params.review_id} exists.`, { status: 404 })
      let users = await User.find({ username: req.params.username })
      if (!users) throw new ServerError(`No user with username ${req.params.username} exists.`, { status: 404 })
      var user = users[0]
      if (user.review_love_list.indexOf(req.params.review_id) > -1) {
        //it exists
        var index = user.review_love_list.indexOf(req.params.review_id);
        if (index !== -1) {
          user.review_love_list.splice(index, 1);
          review.love_count = review.love_count - 1;
        }
      } else {
        user.review_love_list.push(req.params.game_id)
        review.love_count = review.love_count + 1
      }
      let saved_user = await user.save()
      let saved_review = await review.save()
      res.json({ message: `${saved_review.title} saved for ${saved_user.username}` })
    } catch (error) {
      res.handleServerError(error)
    }
  }
}

export const chapter_index = {
  /**
   *  Finds all chapters for specified game by index and returns array
   */
  async get (req, res) {
    try {
      if (req.params.chapter_id) {
        let chapter = await Chapter.findById(req.params.chapter_id)
        if (!chapter) throw new ServerError(`No chapter for with id ${req.params.chapter_id} exists at this moment.`, { status: 404 })
        if (chapter.game != req.params.game_id) {
          throw new ServerError(`Chapter ${chapter._id} with game id ${chapter.game} does not match specified id ${req.params.game_id}`, { status: 404 })
        } else {
          res.json(chapter)
        }
      } else {
        let chapters = await Chapter.find({ game: req.params.game_id })
        if (!chapters) throw new ServerError('No chapter for the game with that id exist at this moment.', { status: 404 })
        res.json(chapters)
      }
    } catch (error) {
      res.handleServerError(error)
    }
  },
  /**
   *  Adds a new chapter for a game or edits an existing chapter if a chapter id is provided
   */
  async post (req, res) {
    try {
      if (req.params.chapter_id) {
        let { title, position, contents } = req.body
        let chapter = await Chapter.findById(req.params.chapter_id)
        if (!chapter) throw new ServerError(`Unable to find chapter with id ${req.params.chapter_id}.`, { status: 404 })
        if (title) {
          chapter.title = title
        }
        if (position) {
          chapter.position = position
        }
        if (contents) {
          chapter.contents = contents
        }
        let saved_chapter = await chapter.save()
        res.json({ message: `${saved_chapter.title} Saved` })
      } else {
        let { title, position, contents } = req.body
        var game_id = req.params.game_id
        let newChapter = new Chapter({ title, position, contents, game_id })
        let savedChapter = await newChapter.save()
        res.json({ message: `${savedChapter.title} Saved` })
      }
    } catch (error) {
      res.handleServerError(error)
    }
  }
}

export const comment_index = {
  /**
   *  Finds all comments for specified game by index and returns array
   */
  async get (req, res) {
    try {
      let comments = Comment.find({ game: req.params.game_id })
      if (!comments) throw new ServerError('No comment for the game with that id exist at this moment.', { status: 404 })
      res.json(comments)
    } catch (error) {
      res.handleServerError(error)
    }
  },
  /**
   *  Adds a new chapter for a game
   */
  async post (req, res) {
    try {
      let { username, chapter, page } = req.body
      var game_id = req.params.game_id
      let newComment = new Comment({ username, chapter, page, game_id })
      let savedComment = await newComment.save()
      res.json({ message: `${savedComment.title} Saved` })
    } catch (error) {
      res.handleServerError(error)
    }
  }
}
