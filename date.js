// This is my local module or rather work as local module
// Just as other module I can require it and use it anywhere in code.

// module.exports.getDate = getDate; is same to next line.
exports.getDate = function () {
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  return today.toLocaleDateString("en-US", options);
};

exports.getDay = function () {
  let today = new Date();
  let options = {
    weekday: "long",
  };

  return today.toLocaleDateString("en-US", options);
};
