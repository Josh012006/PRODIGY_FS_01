




function Input({ id, type, placeholder, label, className, max = undefined, min = undefined}) {
    return (
        <>
            {label && <label htmlFor={id} className="my-2 font-bold">{label}</label>}
            <input className={`p-2 rounded-lg border ${className}`} id={id} name={id} type={type} placeholder={placeholder} required max={max} min={min} />
        </>
    )
}


export default Input;