import { Router } from 'express'
import { master_index, base_type_index, asset_love_index, base_search_index, master_search_index } from './controllers'

const router = Router()

router.get('/base/:asset_id', base_type_index.get)
router.get('/master/type/:type/search/:search_term', master_search_index.get)
router.get('/master/:asset_id', master_index.get)
router.post('/base/:asset_id/toggle_love/:username', asset_love_index.post)
router.get('/base/type/:type', base_type_index.get)
router.get('/base/type/:type/search/:search_term', base_search_index.get)
router.get('/master/type/:type', master_index.get)
router.post('/base/:asset_id', base_type_index.post)
router.post('/base', base_type_index.post)

export default router
