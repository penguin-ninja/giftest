import limax from 'limax';

/**
 * @param {Mongoose Object} model
 * @param { String } slugField slug name field to search slug
 * @param { String } value string value to convert into slug
 */
export default function generateSlug(model, value, slugField = 'slug') {
  const slug = limax(value);
  return model.count({ [slugField]: new RegExp(`^${slug}`, 'i') })
    .then((count) => (count ? `${slug}-${count}` : slug));
}
