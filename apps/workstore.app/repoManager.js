async function loadMainScreen() {
    repoList.innerHTML = ''
    appListScreen.style.display = 'none'
    repoList.style.display = ''
    document.getElementById("head").innerHTML = "Workstore";
    
    for (repo in repos) {
        const repoItem = document.createElement('div')
        repoItem.innerText = repo
        repoItem.onclick = function() {
            loadappListScreen(repoItem.innerText) // Weird hack to work around the fact that repo doesn't work but the innertext of the repoitem does
        }
        repoItem.className = "repoItem"
        repoList.appendChild(repoItem)
    }
    {
        const newRepo = document.createElement('div')
        const newRepoName = document.createElement('input')
        const newRepoURL = document.createElement('input')
        const newRepoButton = document.createElement('input')
        newRepoName.placeholder = "My Repo"
        newRepoURL.placeholder = "https://anura.repo"
        newRepoButton.type = 'submit'
        newRepoButton.value = 'add repo'
        newRepoButton.onclick = function() {
            const repoItem = document.createElement('div')
            repoItem.innerText = newRepoName.value
            if (repos[newRepoName.value]) {
                // send anura notification that repo already exists
                return;
            }
            repos[newRepoName.value] = newRepoURL.value;
            repoItem.onclick = function() {
                loadappListScreen(newRepoName.value)
            }
            repoItem.className = "repoItem";
            repoList.appendChild(repoItem)
            anura.settings.set('workstore-repos', repos)
            window.location.reload()
        }
        newRepo.className = "repoItem"
        newRepo.appendChild(newRepoName)
        newRepo.appendChild(newRepoURL)
        newRepo.appendChild(newRepoButton)
        repoList.appendChild(newRepo)
    }
        

}
loadMainScreen()
