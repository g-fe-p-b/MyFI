import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  model: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

export default function autoIncrementId(schema, options = {}){
  const { modelName, prefix = '', paddingLength = 3 } = options;
  if (!modelName) throw new Error('autoIncrementId plugin requires modelName option');

  const fieldName = `${modelName.toLowerCase()}Id`;

  // add the id field to the schema if not present
  const add = {};
  add[fieldName] = { type: String, unique: true, index: true };
  schema.add(add);

  schema.pre('save', async function(next){
    try{
      if (!this.isNew) return next();
      if (this[fieldName]) return next();
      const counter = await Counter.findOneAndUpdate(
        { model: modelName },
        { $inc: { seq: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      const seq = counter.seq || 1;
      const padded = String(seq).padStart(paddingLength, '0');
      this[fieldName] = `${prefix}${padded}`;
      return next();
    } catch (err){
      return next(err);
    }
  });
}
