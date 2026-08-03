import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getNotifications,
  markNotificationRead,
} from "../services/notificationService";

function Notifications() {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {

    try {

      const data = await getNotifications();

      setNotifications(data.notifications);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to load notifications"
      );

    } finally {

      setLoading(false);

    }

  };

  const handleRead = async (id) => {

    try {

      await markNotificationRead(id);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, isRead: true }
            : item
        )
      );

      toast.success("Notification marked as read");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to update notification"
      );

    }

  };

  return (

    <div className="min-h-screen bg-slate-900 p-8">

      <h1 className="text-4xl font-bold text-white mb-8">

        🔔 Notifications

      </h1>

      {

        loading ? (

          <h2 className="text-white">

            Loading...

          </h2>

        ) : notifications.length === 0 ? (

          <div className="bg-slate-800 rounded-xl p-8">

            <h2 className="text-white text-2xl">

              No Notifications

            </h2>

          </div>

        ) : (

          <div className="space-y-5">

            {

              notifications.map((item) => (

                <div
                  key={item._id}
                  className={`rounded-xl p-6 ${
                    item.isRead
                      ? "bg-slate-800"
                      : "bg-purple-800"
                  }`}
                >

                  <h2 className="text-2xl text-white font-bold">

                    {item.title}

                  </h2>

                  <p className="text-gray-300 mt-2">

                    {item.message}

                  </p>

                  <p className="text-gray-400 mt-3 text-sm">

                    {new Date(item.createdAt).toLocaleString()}
                  </p>

                  {

                    !item.isRead && (

                      <button
                        onClick={() => handleRead(item._id)}
                        className="mt-5 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                      >
                        Mark as Read
                      </button>

                    )

                  }

                </div>

              ))

            }

          </div>

        )

      }

    </div>

  );

}

export default Notifications;