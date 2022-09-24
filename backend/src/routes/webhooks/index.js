import express from 'express';
import axios from 'axios';
import moment from 'moment/moment';
import nodemailer from 'nodemailer';
// import Boom from 'boom';
import Hasura from '../../clients/hasura';
import { GET_MEETING_PARTICIPANTS, GET_MEETING_PARTICIPANTS_REMINDER_QUERY } from './queries';

const router = express.Router();

const smtpConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(smtpConfig);

router.post('/meeting_created', async (req, res, next) => {
  const meeting = req.body.event.data.new;

  const { meetings_by_pk } = await Hasura.request(GET_MEETING_PARTICIPANTS, {
    id: meeting.id,
  });

  const title = meeting.title;
  const { fullName } = meetings_by_pk.user;
  const participants = meetings_by_pk.participants.map(({ user }) => user.email).toString();

  const scheduleEvent = {
    type: 'create_scheduled_event',
    args: {
      webhook: '{{ACTION_BASE_ENDPOINT}}/webhooks/meeting_reminder',
      schedule_at: moment(meetings_by_pk.meeting_date).subtract(2, 'minutes'),
      payload: {
        meeting_id: meeting.id,
      },
    },
  };

  const addEvent = await axios('http://localhost:8080/v1/query', {
    method: 'POST',
    data: JSON.stringify(scheduleEvent),
    headers: {
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
    },
  });

  // const eventData = addEvent.data;
  // console.log(eventData);

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: participants,
    subject: ` ${fullName} sizi bir görüşmeye davet etti!`,
    text: `${fullName} sizi ${title} adlı bir görüşmeye davet etti.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return next(error);
    }

    return res.json({ info });
  });
});

router.post('/meeting_reminder', async (req, res, next) => {
  const { meeting_id } = req.body.payload;

  console.log('meeting reminder:', meeting_id);

  const { meetings_by_pk } = await Hasura.request(GET_MEETING_PARTICIPANTS_REMINDER_QUERY, {
    id: meeting_id,
  });

  const title = meetings_by_pk.title;
  const { email } = meetings_by_pk.user;
  let participants = meetings_by_pk.participants.map(({ user }) => user.email);
  participants.push(email);

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: participants.toString(),
    subject: ` '${title}' başlıklı görüşmeniz için hatırlatma!`,
    text: `'${title}' başlıklı görüşmeniz 2 dakika sonra başlayacaktır. Katılmak için aşağıdaki bağlantıyı kullanabilirsiniz.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return next(error);
    }

    return res.json({ info });
  });
});

export default router;
