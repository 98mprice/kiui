import { Router } from 'express'
import { game_index, review_index, chapter_index, comment_index, game_love_index, review_love_index, game_search_index } from './controllers'

const router = Router()

router.get('/:game_id', game_index.get)
router.get('/', game_index.get)
router.post('/', game_index.post)
router.post('/:game_id', game_index.post)
router.post('/:game_id/toggle_love/:username', game_love_index.post)
router.post('/:game_id/toggle_bookmark/:username', game_love_index.post)
router.get('/search/:search_term', game_search_index.get)

router.get('/:game_id/reviews', review_index.get)
router.post('/:game_id/reviews', review_index.post)
router.post('/:game_id/reviews/:review_id/toggle_love/:username', review_love_index.post)
router.get('/:game_id/chapters', chapter_index.get)
router.get('/:game_id/chapters/:chapter_id', chapter_index.get)
router.post('/:game_id/chapters', chapter_index.post)
router.post('/:game_id/chapters/:chapter_id', chapter_index.post)

router.get('/:game_id/comments', comment_index.get)
router.post('/:game_id/comments', comment_index.post)

export default router
