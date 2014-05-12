/**
 * PostController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  index : function(req,res,next) {
    Post.find().done(function(err,posts){
      if(err) next(err);
      res.view({posts:posts});
    });
  },

  'new' : function(req, res) {
    res.view();
  },

  create : function (req, res, next) {
    Post.create( req.params.all(), function(err, post) {
      if(err) {
        req.session.flash = {
          err : err
        }
        return res.resirect('/posts/new');
      }
      res.redirect('/post/show/'+post.id);
    });
  },

  edit : function(req, res) {
    Post.findOneById(req.param('id'), function(err,post) {
      if(err) return next(err);
      if(!post) return next();
      res.view({post:post, title:'Editing ' + post.title});
    });
  },

  update : function (req, res, next) {
    Post.update( { id: req.param('id') },
      { title : req.param('title'), text : req.param('text') },
      function(err, posts) {
        if(err) {
          req.session.flash = {
            err : err
          }
          return res.resirect('/posts/edit/' + req.param('id') );
        }
        res.redirect('/post/show/'+posts[0].id);
      });
  },

  show : function(req,res,next) {
    Post.findOneById(req.param('id'), function(err,post) {
      if(err) return next(err);
      if(!post) return next();
      res.view({post:post, title:post.title});
    });
  },

  destroy : function(req,res,next) {
    Post.findOneById(req.param('id'), function(err,post){
      if(err) return next(err);
      if(post) post.destroy(function(err){
        if(err)
          return next(err);
        else
          res.redirect('/post');
      });
    })
  },

  upload_file : function(req, res) {
    var fs = require('fs');
    console.log(req.files);

    fs.readFile(req.files.upload.path, function (err, data) {
    // save file
      var newPath = 'assets/files/' + req.files.upload.name;
        fs.writeFile(newPath, data, function (err) {
        if (err) res.view({err: err});
        // redirect to next page
          html = "";
          html += "<script type='text/javascript'>";
          html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
          html += "    var url     = \"/files/" + req.files.upload.name + "\";";
          html += "    var message = \"Uploaded file successfully\";";
          html += "";
          html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
          html += "</script>";

          res.send(html);
      });

    });

  },
};
