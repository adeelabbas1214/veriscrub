node -e '
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: "kqkkasyp",
  api_key: "866562548423459",
  api_secret: "GVs4xTaAK5HvnfZ26mxLwkS6oM",
  secure: true
});

cloudinary.uploader.upload("./public/logo.png", {
  public_id: "veriscrub_logo",
  overwrite: true,
  resource_type: "image"
})
.then(result => {
  console.log("✓ Uploaded successfully! Public ID:", result.public_id);
})
.catch(err => {
  console.error("Upload failed:", err);
});
'