export function FormInput({ label, error, required, className = '', ...props }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-black text-[#111827] mb-2">
        {label}
        {required && <span className="text-[#dc2626] ml-1">*</span>}
      </label>
      <input
        className={`porto-input ${error ? 'error' : ''} ${className}`}
        {...props}
      />
      {error && <p className="porto-error">{error}</p>}
    </div>
  );
}

export function FormTextArea({ label, error, required, className = '', rows = 4, ...props }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-black text-[#111827] mb-2">
        {label}
        {required && <span className="text-[#dc2626] ml-1">*</span>}
      </label>
      <textarea
        className={`porto-input resize-none ${error ? 'error' : ''} ${className}`}
        rows={rows}
        {...props}
      />
      {error && <p className="porto-error">{error}</p>}
    </div>
  );
}

export function FormSelect({ label, error, required, options, className = '', ...props }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-black text-[#111827] mb-2">
        {label}
        {required && <span className="text-[#dc2626] ml-1">*</span>}
      </label>
      <select
        className={`porto-input ${error ? 'error' : ''} ${className}`}
        {...props}
      >
        <option value="">Select {String(label).toLowerCase()}</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="porto-error">{error}</p>}
    </div>
  );
}


