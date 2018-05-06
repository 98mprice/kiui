import { Router } from 'express'
import authenticate from '~/middleware/authenticate'
import { index, username, signIn, signOut, check, love, bookmark } from './controllers'

const router = Router()

router.get('/', authenticate(), index.get)
router.get('/:username', authenticate(), index.get)
router.post('/', index.post)

router.get('/check', check.get)

router.post('/sign-in', signIn.post)
router.post('/sign-out', authenticate(), signOut.post)

router.route('/:username')
  .all(authenticate())
  .get(username.get)
  .post(username.post)
  .delete(username.delete)

export default router
