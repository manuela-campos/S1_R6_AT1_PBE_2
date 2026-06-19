import createMulter from "../config/produto.multer.js";

const uploadImage = createMulter({
  // definir o nome da pasta
  folder: "images",
  // definir os tipos
  allowedTypes: ["image/png", "image/jpeg", "image/jpg"],
  fileSize: 10 * 1024 * 1024, // 10MB
  //single: uma imagem de cada vez
}).single("vinculoImagem");

export default uploadImage;