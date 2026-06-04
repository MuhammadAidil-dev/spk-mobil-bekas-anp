import Breadcrumbs, {
  breadcrumbItemsType,
} from '@/components/navigations/Breadcrumb';

const breadcrumbItems: breadcrumbItemsType[] = [
  {
    label: 'Cars Management',
    href: '/admin/cars',
  },
  {
    label: 'Add Car',
  },
];

export default function AddCarsView() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm">
        <Breadcrumbs breadcrumItems={breadcrumbItems} />
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-7xl flex-1 py-8">
        {/* Title */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Add New Vehicle
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Populate the fields below to add a new asset to the inventory.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50">
              Cancel
            </button>

            <button className="rounded-xl bg-primary px-6 py-3 font-medium text-white transition hover:opacity-90">
              Save Vehicle
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="col-span-12 space-y-6 lg:col-span-8">
            {/* General Information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-6 text-lg font-semibold">
                General Information
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label="Brand">
                  <input
                    type="text"
                    placeholder="Toyota"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary"
                  />
                </Field>

                <Field label="Model">
                  <input
                    type="text"
                    placeholder="Avanza 1.3 E"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary"
                  />
                </Field>

                <Field label="Year">
                  <select className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary">
                    <option>2025</option>
                    <option>2024</option>
                    <option>2023</option>
                    <option>2022</option>
                  </select>
                </Field>

                <Field label="Price">
                  <input
                    type="number"
                    placeholder="165000000"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary"
                  />
                </Field>

                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-medium text-slate-600">
                    Status
                  </label>

                  <div className="flex flex-wrap gap-4">
                    <RadioCard label="Available" />
                    <RadioCard label="Sold" />
                    <RadioCard label="In Review" />
                  </div>
                </div>
              </div>
            </section>

            {/* Technical Specification */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-6 text-lg font-semibold">
                Technical Specifications
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Field label="Mileage (KM)">
                  <input
                    type="number"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  />
                </Field>

                <Field label="Engine Capacity (CC)">
                  <input
                    type="number"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  />
                </Field>

                <Field label="Seat Capacity">
                  <input
                    type="number"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  />
                </Field>

                <Field label="Transmission">
                  <select className="w-full rounded-xl border border-slate-300 px-4 py-3">
                    <option>Automatic</option>
                    <option>Manual</option>
                  </select>
                </Field>

                <Field label="Fuel Type">
                  <select className="w-full rounded-xl border border-slate-300 px-4 py-3">
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>Hybrid</option>
                  </select>
                </Field>

                <Field label="Color">
                  <input
                    type="text"
                    placeholder="White"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  />
                </Field>
              </div>
            </section>

            {/* Description */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-6 text-lg font-semibold">
                Vehicle Description
              </h2>

              <textarea
                rows={6}
                placeholder="Describe vehicle condition..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary"
              />
            </section>
          </div>

          {/* RIGHT */}
          <div className="col-span-12 space-y-6 lg:col-span-4">
            {/* Upload */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-6 text-lg font-semibold">Vehicle Photos</h2>

              <div className="flex flex-col gap-2 rounded-2xl border-2 border-dashed border-slate-300 p-10 text-center">
                <p className="mt-2 text-sm text-slate-500">
                  JPG, PNG, WEBP (Max 5MB)
                </p>

                <label
                  htmlFor="image"
                  className="mt-4 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium cursor-pointer"
                >
                  Browse Files
                </label>
                <input type="file" className="hidden" id="image" name="image" />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="aspect-video rounded-xl bg-slate-100"
                  />
                ))}
              </div>
            </section>

            {/* Score Card */}
            {/* <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <h3 className="font-semibold text-primary">DSS Impact Score</h3>

              <p className="mt-2 text-sm text-slate-500">
                Initial estimation based on vehicle attributes.
              </p>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-bold text-primary">8.4</span>

                <span className="text-sm font-medium text-green-600">+0.2</span>
              </div>

              <div className="mt-4 h-2 rounded-full bg-white">
                <div className="h-full w-[84%] rounded-full bg-primary" />
              </div>
            </section> */}
          </div>
        </div>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  children: React.ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-600">
        {label}
      </label>

      {children}
    </div>
  );
}

function RadioCard({ label }: { label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-300 px-4 py-3">
      <input type="radio" name="status" />
      <span>{label}</span>
    </label>
  );
}
