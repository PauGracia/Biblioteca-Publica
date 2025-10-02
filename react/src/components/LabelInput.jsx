function LabelInput({ 
    label,
    type,
    styleLabel,
    value,
    placeholder,
    onChange,
    autoComplete,
    name,
    ...others
}) {
    return (
        <div style={{ marginBottom: "1rem" }} {...others}>
            {label && <label style={{textAlign: "left"}}>{label}</label>}
            <input
                name={name}
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                autoComplete={autoComplete}
                style={{ display: "block", padding: "0.5rem", width: "100%", textAlign: "center" }}
            />
            <br />
        </div>
    );
}


export default LabelInput;