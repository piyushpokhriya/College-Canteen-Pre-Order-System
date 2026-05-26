import API from "../services/api.js";

export default function renderTimeSlots(container) {
  container.innerHTML = `
    <div class="max-w-2xl bg-white shadow rounded p-6">
      <h2 class="text-xl font-bold mb-4">
        Block Order Time Slots
      </h2>

      <p class="text-gray-600 mb-4">
       Students will not be able to place orders during these time slots.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block font-semibold mb-1">Start Time</label>
          <input
            id="startTime"
            type="time"
            class="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label class="block font-semibold mb-1">End Time</label>
          <input
            id="endTime"
            type="time"
            class="border p-2 rounded w-full"
          />
        </div>
      </div>

      <button
        id="addSlotBtn"
        class="bg-red-600 text-white px-4 py-2 rounded"
      >
        Add Slot
      </button>

      <hr class="my-6" />

      <h3 class="text-lg font-bold mb-3">
        Current Blocked Slots
      </h3>

      <div id="slotList"></div>
    </div>
  `;

  const startInput = container.querySelector("#startTime");
  const endInput = container.querySelector("#endTime");
  const addSlotBtn = container.querySelector("#addSlotBtn");
  const slotList = container.querySelector("#slotList");

  function timeToMinutes(time) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  function minutesToTime(minutes) {
    const h = String(Math.floor(minutes / 60)).padStart(2, "0");
    const m = String(minutes % 60).padStart(2, "0");
    return `${h}:${m}`;
  }

  async function loadSlots() {
    try {
      const res = await API.get("/timeslots");
      const slots = res.data;

      if (!slots.length) {
        slotList.innerHTML = `
          <p class="text-gray-500">
            No blocked slots added.
          </p>
        `;
        return;
      }

      slotList.innerHTML = slots
        .map(
          (slot) => `
            <div class="flex justify-between items-center border p-3 rounded mb-2">
              <span>
                ${minutesToTime(slot.startMinutes)} - ${minutesToTime(slot.endMinutes)}
              </span>

              <button
                data-id="${slot._id}"
                class="deleteSlot bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          `
        )
        .join("");

      container.querySelectorAll(".deleteSlot").forEach((btn) => {
        btn.onclick = async () => {
          await API.delete(`/timeslots/${btn.dataset.id}`);
          loadSlots();
        };
      });
    } catch (err) {
      console.error(err);
      slotList.innerHTML = `
        <p class="text-red-500">
          Failed to load time slots
        </p>
      `;
    }
  }

  addSlotBtn.onclick = async () => {
    const startTime = startInput.value;
    const endTime = endInput.value;

    if (!startTime || !endTime) {
      alert("Please select start and end time");
      return;
    }

    try {
      await API.post("/timeslots", {
        startMinutes: timeToMinutes(startTime),
        endMinutes: timeToMinutes(endTime),
      });

      startInput.value = "";
      endInput.value = "";

      loadSlots();
    } catch (err) {
      console.error(err);
      alert("Failed to add time slot");
    }
  };

  loadSlots();
}