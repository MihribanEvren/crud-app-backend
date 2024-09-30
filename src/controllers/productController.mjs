//@desc     Get all products
//@route    GET /api/products
export const getProducts = (req, res) => {
  console.log(req.headers.cookie);
  console.log(req.cookies); //signed yok ise
  console.log(req.signedCookies.hello); //signed var ise
  if (req.signedCookies.hello && req.signedCookies.hello === 'world')
    return res.send([{ id: 123, name: 'chicken breast', price: 12.99 }]);
  return res.status(403).send({ msg: 'Sorry. You need the correct cookie' });
};
