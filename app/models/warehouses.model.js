module.exports = (mongoose, schema, model) => {
    const mongooseDelete = require('mongoose-delete');
    const warehousesSchema = new schema(
        {
            regions: {
                type: Array,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            },
            address: {
                type: String,
                required: true
            }
        },
        {collection: "warehouses", timestamps: { createdAt: 'createdAt' }}
    ).plugin(mongooseDelete, { deletedAt : true });

    return model("warehouses", warehousesSchema);
};