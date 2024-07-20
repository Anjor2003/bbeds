import { defineField } from "sanity"

const hotelRoom = {
  name: 'hotelRoom',
  title: 'Hotel Room',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required().max(50).error('Maximo  50 caracteres'),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required().min(100).error('Minimo 100 caracteres'),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'discount',
      title: 'Discount',
      type: 'number',
      validation: (Rule) => Rule.min(0),
      initialValue: 0,
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{
        type: 'object', fields: [
          { name: 'url', type: "url", title: "URL" },
          { name: 'file', type: "file", title: "File" },
        ],
      }],
      validation: (Rule) => Rule.required().min(3).error('Minimo 3 imagenes son necesarias'),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'object',
      fields: [
        { name: 'url', type: "url", title: "URL" },
        { name: 'file', type: "file", title: "File" },
      ],
      validation: (Rule) => Rule.required().error('Imagen de portada requerida'),
    }),
    defineField({
      name: 'type',
      title: 'Room Type',
      type: 'string',
      options: {
        list: [
          { title: 'Standard', value: 'standard' },
          { title: 'Deluxe', value: 'deluxe' },
          { title: 'Suite', value: 'suite' },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'standard',
    }),
    defineField({
      name: 'specialNote',
      title: 'Special Note',
      type: 'text',
      validation: (Rule) => Rule.required(),
      initialValue: 'ckeck-in time is 12:00 and check-out time is 11:00 AM. Si desea salir despues de esa hora , por favor pongase en contacto con recepcion',
    }),
    defineField({
      name: 'dimension',
      title: 'Dimension',
      type: 'string',
    }),
    defineField({
      name: 'numberOfBeds',
      title: 'Number of beds',
      type: 'number',
      validation: (Rule) => Rule.min(1),
      initialValue: 1,
    }),
    defineField({
      name: 'offeredAmenities',  
      title: 'Offered Amenities',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'icon', type: "string", title: "Icon" },
        { name: 'amenity', type: "string", title: "Amenity" },
      ]}], 
    }),
    defineField({
      name: 'isBooked',
      title: 'Is Booked',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isfeatured',
      title: 'Is Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'reviews',
      title: 'Reviews',
      type: 'array',
      of: [{ type: 'review'}],
    }),
  ],
}

export default hotelRoom