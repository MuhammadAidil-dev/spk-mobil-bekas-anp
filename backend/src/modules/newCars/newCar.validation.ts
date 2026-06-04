import Joi from 'joi';

// ============================================================
// ENUMS
// ============================================================

const TRANSMISSION_VALUES = ['manual', 'automatic'] as const;

const FUEL_TYPE_VALUES = ['gasoline', 'diesel', 'hybrid', 'electric'] as const;

const CURRENT_YEAR = new Date().getFullYear();

// ============================================================
// CREATE NEW CAR
// ============================================================

export const createNewCarSchema = Joi.object({
  brand: Joi.string().trim().required().messages({
    'string.empty': 'Brand wajib diisi',
    'any.required': 'Brand wajib diisi',
  }),

  model: Joi.string().trim().required().messages({
    'string.empty': 'Model wajib diisi',
    'any.required': 'Model wajib diisi',
  }),

  year: Joi.number()
    .integer()
    .min(1900)
    .max(CURRENT_YEAR + 1)
    .strict()
    .required()
    .messages({
      'number.base': 'Tahun harus berupa angka',
      'number.integer': 'Tahun harus berupa angka bulat',
      'number.min': 'Tahun minimal 1900',
      'number.max': `Tahun maksimal ${CURRENT_YEAR + 1}`,
      'any.required': 'Tahun wajib diisi',
    }),

  price: Joi.number().positive().strict().required().messages({
    'number.base': 'Harga harus berupa angka',
    'number.positive': 'Harga harus lebih dari 0',
    'any.required': 'Harga wajib diisi',
  }),

  engine_capacity: Joi.number().positive().strict().required().messages({
    'number.base': 'Kapasitas mesin harus berupa angka',
    'number.positive': 'Kapasitas mesin harus lebih dari 0',
    'any.required': 'Kapasitas mesin wajib diisi',
  }),

  seat_capacity: Joi.number().integer().min(1).strict().required().messages({
    'number.base': 'Kapasitas kursi harus berupa angka',
    'number.integer': 'Kapasitas kursi harus berupa angka bulat',
    'number.min': 'Kapasitas kursi minimal 1',
    'any.required': 'Kapasitas kursi wajib diisi',
  }),

  fuel_efficiency: Joi.number().positive().strict().required().messages({
    'number.base': 'Efisiensi BBM harus berupa angka',
    'number.positive': 'Efisiensi BBM harus lebih dari 0',
    'any.required': 'Efisiensi BBM wajib diisi',
  }),

  transmission: Joi.string()
    .valid(...TRANSMISSION_VALUES)
    .required()
    .messages({
      'any.only': 'Transmisi harus manual atau automatic',
      'any.required': 'Transmisi wajib diisi',
    }),

  fuel_type: Joi.string()
    .valid(...FUEL_TYPE_VALUES)
    .required()
    .messages({
      'any.only':
        'Tipe bahan bakar harus gasoline, diesel, hybrid, atau electric',
      'any.required': 'Tipe bahan bakar wajib diisi',
    }),

  color: Joi.string().trim().required().messages({
    'string.empty': 'Warna wajib diisi',
    'any.required': 'Warna wajib diisi',
  }),

  image_url: Joi.string().uri().trim().required().messages({
    'string.uri': 'Format URL gambar tidak valid',
    'any.required': 'URL gambar wajib diisi',
  }),

  description: Joi.string().trim().required().messages({
    'string.empty': 'Deskripsi wajib diisi',
    'any.required': 'Deskripsi wajib diisi',
  }),

  is_active: Joi.boolean().default(true),
}).options({
  abortEarly: false,
  allowUnknown: false,
});

// ============================================================
// UPDATE NEW CAR
// ============================================================

export const updateNewCarSchema = Joi.object({
  brand: Joi.string().trim(),

  model: Joi.string().trim(),

  year: Joi.number()
    .integer()
    .min(1900)
    .max(CURRENT_YEAR + 1)
    .strict(),

  price: Joi.number().positive().strict(),

  engine_capacity: Joi.number().positive().strict(),

  seat_capacity: Joi.number().integer().min(1).strict(),

  fuel_efficiency: Joi.number().positive().strict(),

  transmission: Joi.string().valid(...TRANSMISSION_VALUES),

  fuel_type: Joi.string().valid(...FUEL_TYPE_VALUES),

  color: Joi.string().trim(),

  image_url: Joi.string().uri().trim(),

  description: Joi.string().trim(),

  is_active: Joi.boolean(),
})
  .min(1)
  .options({
    abortEarly: false,
    allowUnknown: false,
  });
