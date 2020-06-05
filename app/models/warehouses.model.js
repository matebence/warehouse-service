module.exports = (mongoose, schema, model) => {
    const mongooseDelete = require('mongoose-delete');
    return model("warehouses", new schema(
        {
            regions: {
                type: Array
            },
            name: {
                type: String
            },
            country: {
                type: String
            },
            address: {
                type: String
            }
        },
        {collection: "warehouses", timestamps: { createdAt: 'created_at' }}
    ).plugin(mongooseDelete, { deletedAt : true }));
};