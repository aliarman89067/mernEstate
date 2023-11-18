import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAIAAgAMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAAAQIFBAYDB//EADEQAAICAQICBwcEAwAAAAAAAAABAgMRBAVBcRIhIjFRYeEyQlKBkbHBE2Kh0SMzQ//EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFhEBAQEAAAAAAAAAAAAAAAAAABEB/9oADAMBAAIRAxEAPwD9cABUAAAAAAAAAAAAAAqyWyGBDIbJZVgfUAAAAAAMbcNa7m66pNVLvx73oB2ajcqaniCdkvLu+pyS3W9vswhH+TgAg747ren2oVy5ZR16fcqbWoz/AMcvPu+pigQenIbMbQa50yVVss1Pu/b6GwAZAZVgGQxkhgfcAAAABx7rf+lp1GLxKx4XLiYhobzLOohHgoGeUAAAAIANmztd7t0/Rk8yg8fLgYrO7Z5Y1E4+MANcqySrIDZVsNlGwOwAAAABkbzFrUQlwcPsZ5t7pR+rp+lFdqHX8uJiAAAyiCGwQwB3bQs3zl4Qx9TgNnbaXVp+lL2pvPy4DR1tlWyWyjZAbKthsq2B3gAAAABj7honU3bUs1vvXw+hsESlGCzJqK8W8AeZIbNm3Q6bULp0tRb4w60zlntVqfZnCXPKLRnBnfHa7c9qyEV5ZZ0V6LT6ddOyXSx70+pCjl0GidrVlqxBdyfvehq5CkpRzGSafFMq31EBsq2GyrAZKSYbKtgaYAAAGXumseXRU8fG19gL6vc1BuGnxKXGb7kZdttlrcrJuT8yhDZRMJzreYSlF+KeD7x3DVRX+3PNI5iGB0z3DVS/645JHNOcpvpTk5PxbyQyrAvXbOqWa5uL8jQ024qeI6jqfCXD5mWQ2B6Jsq2Z23at5VNjzn2P6O9sghsq2GyrYGuAAPnqLVTROx8F1czzkm5Sbk8tvLZr7zPFEY/FIxmMBsgEFAhghsAVJbKsBJlWMkMCMtNNPDXWmblNquqhPxXX5GEzS2ueaZQ+GX3IOwhsNkZA2Q2GVYGbvb7NPN/gyjU3r2aeb/BlDBADZVlDJAZABlWw2VYBlWw2VYBmhtL7NvNGc2d+0+zbzRBoNkAgD//Z",
  },
  favourite: [String],
});
const userModel = mongoose.model("user", userSchema);
export default userModel;
