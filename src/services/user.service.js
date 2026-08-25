import projectRepository from "../repositories/project.repository.js";
import userRepository from "../repositories/user.repository.js";

async function getAll() {
    return await userRepository.getAll();
}

const userService = {
    getAll,
};

export default userService;