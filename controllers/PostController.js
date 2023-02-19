
const PostModel = require("../models/Post")

exports.create = async (req, res) => {
   try {
      const doc = new PostModel({
         title: req.body.title,
         text: req.body.text,
         imageUrl: req.body.imageUrl,
         user: req.userId,
         tags: req.body.tags,
      })

      const post = await doc.save()
      res.json(post)
   } catch (err) {
      console.log(err)
      res.status(500).json({
         massage: "Can't make your post"
      })
   }
}


exports.getAll = async (req, res) => {
   try {
      const posts = await PostModel.find().populate('user');
      res.json(posts);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось получить статьи',
      });
   }
};

exports.getLastTags = async (req, res) => {
   try {
      const posts = await PostModel.find().limit(5)
      const tags = posts.map(obj => obj.tags).flat().slice(0, 5)
      res.json(tags)
   } catch (err) {
      console.log(err)
      res.status(500).json({
         massage: "Can't take posts"
      })
   }
}


exports.getOne = async (req, res) => {
   try {
      const postId = req.params.id

      PostModel.findOneAndUpdate({
         _id: postId,
      }, {
         $inc: { viewsCount: 1 },
      },
         {
            returnDocument: 'after',
         },
         (err, doc) => {
            if (err) {
               console.log(err)
               return res.status(500).json({
                  massage: "Can't return post"
               })
            }

            if (!doc) {
               return res.status(404).json({
                  massage: "Post not found"
               })
            }
            res.json(doc)
         }

      ).populate({ path: "user" })
   } catch (err) {
      console.log(err)
      res.status(500).json({
         massage: "Can't take posts"
      })
   }
}


exports.remove = async (req, res) => {
   try {
      const postId = req.params.id

      PostModel.findByIdAndDelete({
         _id: postId,
      }, (err, doc) => {
         if (err) {
            console.log(err)
            res.status(500).json({
               massage: "Can't delete post"
            })
         }
         if (!doc) {
            return res.status(404).json({
               massage: "Post not found"
            })
         }
         res.json({
            secces: true,
         })
      })

   } catch (err) {
      console.log(err)
      res.status(500).json({
         massage: "Can't take posts"
      })
   }
}

exports.update = async (req, res) => {
   try {
      const postId = req.params.id

      await PostModel.updateOne(
         {
            _id: postId,
         },
         {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.userId,
            tags: req.body.tags,
         },
      );

      res.json({
         success: true,
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Can t update post ',
      });
   }
}