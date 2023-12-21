import { RequestHandler } from "express";
import BookingRequests from "../models/BookingRequests";
import Listings from "../models/Listings";
import Notifications from "../models/GuestNotifications";
import Users from "../models/Users";
import Reservations from "../models/Reservations";

type TSendBookingRequest = {
  guestName: string;
  hostID: string;
  date: { from: string; to: string };
  message: string;
  type: string;
  listingID: string;
};

export const updateBookingRequestNotification = async (data: any) => {
  try {
    await Notifications.findByIdAndUpdate(data.notificationID, {
      read: true,
    });

    const updateBookingRequest = await BookingRequests.findByIdAndUpdate(
      data.bookingRequestID._id,
      {
        status: data.status,
      }
    );

    const updateListingReservedDates = await Listings.findByIdAndUpdate(
      data.bookingRequestID.listingID._id,
      {
        $push: {
          reservedDates: {
            isReserved: true,
            from: data.bookingRequestID.requestedBookingDateStartsAt,
            to: data.bookingRequestID.requestedBookingDateEndsAt,
          },
        },
      }
    );

    const guestNotification = await Notifications.create({
      toUserID: data.guestID._id,
      fromUserID: data.hostID._id,
      notificationType: "Booking-Confirmed",
      bookingRequest: updateBookingRequest?._id,
    });

    await Users.findByIdAndUpdate(data.guestID._id, {
      $push: {
        notifications: guestNotification._id,
      },
    });

    const newReservation = await Reservations.create({
      guestID: data.guestID._id,
      listingID: data.bookingRequestID.listingID._id,
      message: data.bookingRequestID.message,
      bookingStartsAt: data.bookingRequestID.requestedBookingDateStartsAt,
      bookingEndsAt: data.bookingRequestID.requestedBookingDateEndsAt,
    });

    const addReservation = await Users.findByIdAndUpdate(data.hostID._id, {
      $push: {
        reservations: newReservation._id,
      },
    });

    return { guestNotification, updateListingReservedDates };
  } catch (error) {
    console.error(error);
  }
};

export const sendBookingRequest = async (data: TSendBookingRequest) => {
  try {
    const guestID = await Users.findOne({ username: data.guestName });

    const newBookingRequest = await BookingRequests.create({
      ...data,
      requestedBookingDateStartsAt: data.date.from,
      requestedBookingDateEndsAt: data.date.to,
      guestID: guestID && guestID._id,
    });

    const addBookingRequest = await Users.findOneAndUpdate(
      { username: data.guestName },
      {
        $push: {
          bookingRequests: newBookingRequest._id,
        },
      },
      { new: true }
    );

    const newNotification = await Notifications.create({
      bookingRequest: newBookingRequest._id,
      notificationType: data.type,
      toUserID: data.hostID,
      fromUserID: addBookingRequest && addBookingRequest._id,
    });

    await newNotification.populate([
      "bookingRequest",
      { select: ["username", "photoUrl"], path: "fromUserID" },
    ]);

    const addNotification = await Users.findByIdAndUpdate(data.hostID, {
      $push: { notifications: newNotification._id },
    });

    return {
      newBookingRequest,
      addBookingRequest,
      newNotification,
      addNotification,
    };
  } catch (error) {
    console.log(error);
  }
};
