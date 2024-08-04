import styled from "styled-components";

const PasswordRequirement = styled.div`
  color: ${(props) => props.$requirement};
  font-size: 0.9em;
`;

export default function PasswordRequirements({ password }) {
  const requirements = [
    {
      text: "min. 8 Zeichen lang",
      requirement: password.length >= 8,
    },
    {
      text: "min. 1 Sonderzeichen ",
      requirement: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
    {
      text: "min. 1 Zahl",
      requirement: /\d/.test(password),
    },
  ];

  return (
    <div>
      {requirements.map((req, index) => (
        <PasswordRequirement
          key={index}
          $requirement={req.requirement ? "var(--success)" : "var(--danger)"}
        >
          {req.text}
        </PasswordRequirement>
      ))}
    </div>
  );
}
