import { runAppleScript } from 'run-applescript';

export const getContactName = async (phoneNumber: string) => {

  if (phoneNumber.startsWith("chat")) {
    return "Group Chat";
  }

  const number = phoneNumber.replace("+1", "");

  const phoneNumbers = [
    // 5105552592
    number,
    // 510-555-2592
    number.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"),
    // 510.555.2592
    number.replace(/(\d{3})(\d{3})(\d{4})/, "$1.$2.$3"),
    // (510) 555-2592
    number.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"),
    // (510) 555 2592
    number.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2 $3"),
    // 510 555 2592
    number.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3"),
  ];

  const command = phoneNumbers.map(number => `value of first phones contains "${number}"`).join(" or ");

  const script = `tell application "Contacts"
  set thePerson to first person whose ${command}
  set firstName to first name of thePerson
  set lastName to last name of thePerson
  return firstName & " " & lastName
  end tell`

  try {
    const result = await runAppleScript(script);

    await new Promise(resolve => setTimeout(resolve, 5000));

    return result;
  } catch (e) {
    return "Unknown";
  }
}
