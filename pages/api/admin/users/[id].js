import { getSession } from 'next-auth/react';
import User from '../../../../models/User';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send('admin signin required');
  }

  if (req.method === 'DELETE') {
    return deleteHandler(req, res);
  }
  return res.status(400).send({ message: 'Method not allowed' });
};

// eslint-disable-next-line consistent-return
const deleteHandler = async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    if (user.email === 'satyendrasingh@gmail.com') {
      return res.status(400).send({ message: 'Can not delete admin' });
    }
    await user.remove();
    await db.disconnect();
    res.send({ message: 'User Deleted' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'User Not Found' });
  }
};

export default handler;
