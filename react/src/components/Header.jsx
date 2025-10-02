

function Header ({ level, children, ...others })  {
  const Tag = `h${level}`;
  return <Tag style={{ width: "100%" , marginBottom: "40px"  }} {...others}>{children}</Tag>;
};

export default Header;