import Master_Asset from './models/master_models'
import Base_Asset from './models/base_models'
import { ServerError } from 'express-server-error'

export const master_index = {
  /**
   *  Get all Master Assets of a specific type
   */
  async get (req, res) {
    try {
      if (req.params.asset_id) {
        let asset = await Master_Asset.findById(req.params.asset_id)
        if (!asset) throw new ServerError(`No asset with id ${req.params.asset_id} exists at the moment`, { status: 404 })
        res.json(asset)
      } else if (req.params.type) {
        let assets = await Master_Asset.find({ type: req.params.type })
        console.log("im finding master assets of type " + req.params.type)
        if (!assets) throw new ServerError('No assets exist at this moment.', { status: 404 })
        res.json(assets)
      } else {
        throw new ServerError(`No parameters provided for asset id or type`, { status: 404 })
      }
    } catch (error) {
      res.handleServerError(error)
    }
  }
}

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

export const master_search_index = {
  /**
   *  Finds all games or specific game by id and returns array
   */
  async get (req, res) {
    try {
      console.log("searching for" + req.params.search_term)
      const regex = new RegExp(escapeRegex(req.params.search_term), 'gi');
      var type = req.params.type
      let master_assets = await Master_Asset.find({
        /*name: regex*/
        $and: [
              { name: regex },
              { type: type }
          ]
       })
      var modified_master = [

      ]
      for (var i = 0; i < master_assets.length; i++) {
        console.log("trying to find base asset" + master_assets[i].bases[0])
        var base_asset = await Base_Asset.findById(master_assets[i].bases[0])
        console.log("returned" + JSON.stringify(base_asset))
        if (base_asset) {
          console.log("it is tru")
          modified_master.push({
            url: base_asset.url,
            name: master_assets[i].name
          })
          //console.log("it is tru" + JSON.stringify(modified_master[i]))
        }
      }
      console.log("returning " + JSON.stringify(master_assets))
      res.json(modified_master)
    } catch (error) {
      res.handleServerError(error)
    }
  }
}

export const base_type_index = {
  /**
   *  Get all Base Assets of a specific type
   */
  async get (req, res) {
    try {
      if (req.params.asset_id) {
        let asset = await Base_Asset.findById(req.params.asset_id)
        if (!asset) throw new ServerError(`No base asset with id ${req.params.asset_id} exists at the moment`, { status: 404 })
        res.json(asset)
      } else if (req.params.type) {
        let assets = await Base_Asset.find({ type: req.params.type })
        console.log("im finding assets by base type " + JSON.stringify(assets))
        if (!assets) throw new ServerError('No assets exist at this moment.', { status: 404 })
        res.json(assets)
      } else {
        throw new ServerError(`No parameters provided for asset id or type`, { status: 404 })
      }
    } catch (error) {
      res.handleServerError(error)
    }
  },
  /**
   *  Add a base asset and link to corresponding master asset if applicable or edit existing base asset
   */
  async post (req, res) {
    try {
      let { master_name, name, type, url, username } = req.body
      if (req.params.asset_id) {
        console.log("modifying base asset " + req.params.asset_id + " " + name + ", " + type + ", " + username + ", " + url )
        let asset = await Base_Asset.findById(req.params.asset_id)
        if (name) {
          asset.name = name
        }
        if (type) {
          asset.type = type
        }
        if (url) {
          asset.url = url
        }
        if (username) {
          asset.username = username
        }
        let saved_asset = await asset.save()
        res.json({ message: `${saved_asset.name} edited` })
      } else {
        console.log("adding base asset " + name + ", " + type + ", " + username + ", " + url )
        var love_count = 0;
        let newBaseAsset = new Base_Asset({ name, type, url, username, love_count })
        let saved_asset = await newBaseAsset.save()
        if (type == "CHARACTER") {
          console.log("looking if character " + master_name + " exists")
          let master_assets = await Master_Asset.find({ name: master_name })
          var master_asset = master_assets[0]
          console.log("master asset" + master_asset)
          if (!master_asset) {
            console.log("couldn't find this asset so making a new onefor" + master_name)
            let newMasterAsset = new Master_Asset({
              name: master_name ,
              type: type
            })
            console.log("going to push " + newBaseAsset._id + " to this new master bases array" + newMasterAsset.name)
            newMasterAsset.bases.push(newBaseAsset._id)
            let savedMasterAsset = await newMasterAsset.save()
          } else {
            console.log("found this asset so going to add to bases array" + JSON.stringify(master_asset.bases))
            if (master_asset.bases.indexOf(newBaseAsset._id) == -1) {
              console.log("wasnt in bases array so going ot add")
              master_asset.bases.push(newBaseAsset._id)
              let savedMasterAsset = await master_asset.save()
            }
          }
        }
        res.json({ message: `${saved_asset.name} saved` })
      }
    } catch (error) {
      res.handleServerError(error)
    }
  }
}

export const asset_love_index = {
  /**
   *  Adds or subtracts from current love for asset
   */
  async post (req, res) {
    try {
      let asset = await Base_Asset.findById(req.params.asset_id)
      if (!asset) throw new ServerError(`No review with id ${req.params.asset_id} exists.`, { status: 404 })
      let user = await User.find({ username: req.params.username })
      if (!user) throw new ServerError(`No user with username ${req.params.username} exists.`, { status: 404 })
      if (user.asset_love_list.indexOf(req.params.review_id) > -1) {
        //it exists
        var index = user.asset_love_list.indexOf(req.params.asset_id);
        if (index !== -1) {
          user.asset_love_list.splice(index, 1);
          asset.love_count = asset.love_count - 1;
        }
      } else {
        user.asset_love_list.push(req.params.game_id)
        asset.love_count = asset.love_count + 1
      }
      let saved_user = await user.save()
      let saved_review = await review.save()
      res.json({ message: `${saved_asset.title} saved for ${saved_user.username}` })
    } catch (error) {
      res.handleServerError(error)
    }
  }
}

export const base_search_index = {
  /**
   *  Finds all games or specific game by id and returns array
   */
  async get (req, res) {
    try {
      console.log("searching for" + req.params.search_term)
      const regex = new RegExp(escapeRegex(req.params.search_term), 'gi');
      var type = req.params.type
      console.log("type" + type)
      let base_assets = await Base_Asset.find({
        /*name: regex*/
        $and: [
              { name: regex },
              { type: type }
          ]
       }).sort({ love_count : -1})
      console.log("returning " + JSON.stringify(base_assets))
      res.json(base_assets)
    } catch (error) {
      res.handleServerError(error)
    }
  }
}
