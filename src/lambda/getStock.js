
exports.handler = async function (event, context) {
  try {
    const body = await JSON.parse(event.body);
    return {
      statusCode: 200,
      body: JSON.stringify("ok")
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify(err.message)
    }
  }
};
