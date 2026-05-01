import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Tag name must be at least 2 characters'],
      maxlength: [30, 'Tag name cannot exceed 30 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for posts count
tagSchema.virtual('postsCount', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'tags',
  count: true,
});

const Tag = mongoose.model('Tag', tagSchema);

export default Tag;
